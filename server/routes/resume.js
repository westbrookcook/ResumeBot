const express = require('express');
const router = express.Router();

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

    // Basic resume template generation
    const resume = {
      id: Date.now(),
      personalInfo,
      workExperience,
      education,
      skills,
      createdAt: new Date().toISOString()
    };

    // TODO: Integrate with AI for content enhancement
    const enhancedResume = {
      ...resume,
      summary: generateSummary(personalInfo, workExperience),
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

  if (resume.personalInfo.summary) {
    content += `SUMMARY\n${resume.personalInfo.summary}\n\n`;
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

  return content;
}

module.exports = router;