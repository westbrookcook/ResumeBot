const { OpenAI } = require('openai');

class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async enhanceResumeContent(resumeData) {
    try {
      if (!process.env.OPENAI_API_KEY) {
        console.warn('OpenAI API key not provided, using basic template');
        return this.getBasicEnhancements(resumeData);
      }

      const prompt = this.buildPrompt(resumeData);

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume writer. Help improve resume content by making it more professional and impactful.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      });

      return this.parseAIResponse(response.choices[0].message.content);
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.getBasicEnhancements(resumeData);
    }
  }

  buildPrompt(resumeData) {
    let prompt = `Please help improve this resume content:\n\n`;
    prompt += `Name: ${resumeData.personalInfo.name}\n`;
    prompt += `Email: ${resumeData.personalInfo.email}\n`;

    if (resumeData.workExperience.length > 0) {
      prompt += `\nWork Experience:\n`;
      resumeData.workExperience.forEach((exp, index) => {
        prompt += `${index + 1}. ${exp.position} at ${exp.company}\n`;
        prompt += `   Description: ${exp.description}\n`;
      });
    }

    prompt += `\nPlease provide:
1. An improved professional summary (2-3 sentences)
2. Enhanced descriptions for each work experience (if any)
3. Suggestions for skills that would complement this background

Format your response as JSON with keys: summary, workExperienceEnhancements, suggestedSkills`;

    return prompt;
  }

  parseAIResponse(response) {
    try {
      return JSON.parse(response);
    } catch (error) {
      // If parsing fails, try to extract content manually
      return {
        summary: "Dedicated professional with proven experience and strong analytical skills.",
        workExperienceEnhancements: [],
        suggestedSkills: ["Communication", "Problem Solving", "Leadership", "Time Management"]
      };
    }
  }

  getBasicEnhancements(resumeData) {
    const summary = this.generateBasicSummary(resumeData);
    const skills = this.generateBasicSkills(resumeData);

    return {
      summary,
      workExperienceEnhancements: [],
      suggestedSkills: skills
    };
  }

  generateBasicSummary(resumeData) {
    if (resumeData.workExperience.length === 0) {
      return `${resumeData.personalInfo.name} is a motivated professional ready to contribute to a dynamic organization.`;
    }

    const latestRole = resumeData.workExperience[0];
    return `Experienced ${latestRole.position} with a proven track record in ${latestRole.company}. Strong professional with excellent communication and analytical skills.`;
  }

  generateBasicSkills(resumeData) {
    const baseSkills = ["Communication", "Problem Solving", "Time Management", "Teamwork"];

    // Add role-specific skills based on work experience
    const roleSpecificSkills = [];
    resumeData.workExperience.forEach(exp => {
      const role = exp.position.toLowerCase();
      if (role.includes('developer') || role.includes('engineer')) {
        roleSpecificSkills.push("Programming", "Software Development", "Technical Analysis");
      } else if (role.includes('manager') || role.includes('lead')) {
        roleSpecificSkills.push("Leadership", "Project Management", "Strategic Planning");
      } else if (role.includes('sales') || role.includes('marketing')) {
        roleSpecificSkills.push("Sales", "Customer Relations", "Marketing Strategy");
      }
    });

    return [...baseSkills, ...roleSpecificSkills].slice(0, 8);
  }
}

module.exports = new OpenAIService();