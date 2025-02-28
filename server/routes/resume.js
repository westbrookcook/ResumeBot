const express = require('express');
const router = express.Router();
const openaiService = require('../services/openaiService');

// Generate resume based on form data
router.post('/generate', async (req, res) => {
  try {
    const { personalInfo, workExperience, education, skills } = req.body;

    // Validate required fields
    if (!personalInfo?.name || !personalInfo?.email) {
      return res.status(400).json({
        error: 'Name and email are required'
      });
    }

    // Get AI enhancements
    const aiEnhancements = await openaiService.enhanceResumeContent({
      personalInfo,
      workExperience,
      education,
      skills
    });

    // Basic resume template generation with AI enhancements
    const resume = {
      id: Date.now(),
      personalInfo: {
        ...personalInfo,
        summary: aiEnhancements.summary || personalInfo.summary
      },
      workExperience,
      education,
      skills: skills.length > 0 ? skills : aiEnhancements.suggestedSkills,
      aiSuggestions: aiEnhancements,
      createdAt: new Date().toISOString()
    };

    const enhancedResume = {
      ...resume,
      formattedContent: formatResumeContent(resume)
    };

    res.json({
      success: true,
      resume: enhancedResume,
      message: 'Resume generated successfully'
    });
  } catch (error) {
    console.error('Resume generation error:', error);
    res.status(500).json({
      error: 'Failed to generate resume',
      details: error.message
    });
  }
});

// Get AI suggestions for resume content
router.post('/suggestions', async (req, res) => {
  try {
    const { personalInfo, workExperience } = req.body;

    if (!personalInfo?.name) {
      return res.status(400).json({
        error: 'Personal information is required for suggestions'
      });
    }

    const suggestions = await openaiService.enhanceResumeContent({
      personalInfo,
      workExperience: workExperience || [],
      education: [],
      skills: []
    });

    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      error: 'Failed to get suggestions',
      details: error.message
    });
  }
});

// Helper functions
function generateSummary(personalInfo, workExperience) {
  if (workExperience.length === 0) {
    return `${personalInfo.name} is a motivated professional ready to begin their career journey.`;
  }

  const latestRole = workExperience[0];
  const totalExperience = workExperience.length;

  return `${personalInfo.name} is an experienced ${latestRole.position} with ${totalExperience} position${totalExperience > 1 ? 's' : ''} of professional experience.`;
}

function formatResumeContent(resume) {
  let content = `${resume.personalInfo.name}\n`;
  content += `${resume.personalInfo.email} | ${resume.personalInfo.phone}\n`;
  content += `${resume.personalInfo.location}\n\n`;

  // Use AI-generated summary or user-provided summary
  const summary = resume.personalInfo.summary || resume.aiSuggestions?.summary;
  if (summary) {
    content += `PROFESSIONAL SUMMARY\n${summary}\n\n`;
  }

  if (resume.workExperience.length > 0) {
    content += `WORK EXPERIENCE\n`;
    resume.workExperience.forEach(exp => {
      content += `${exp.position} at ${exp.company}\n`;
      content += `${exp.startDate} - ${exp.endDate || 'Present'}\n`;
      content += `${exp.description}\n\n`;
    });
  }

  if (resume.education.length > 0) {
    content += `EDUCATION\n`;
    resume.education.forEach(edu => {
      content += `${edu.degree}\n`;
      content += `${edu.school}, ${edu.graduationYear}\n\n`;
    });
  }

  if (resume.skills && resume.skills.length > 0) {
    content += `SKILLS\n`;
    content += resume.skills.join(' • ') + '\n\n';
  }

  return content;
}

module.exports = router;