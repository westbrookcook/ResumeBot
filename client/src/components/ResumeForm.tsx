import React, { useState } from 'react';
import './ResumeForm.css';

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  school: string;
  degree: string;
  graduationYear: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
}

const ResumeForm: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      summary: ''
    },
    workExperience: [],
    education: [],
    skills: []
  });

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const addWorkExperience = () => {
    setResumeData(prev => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        { company: '', position: '', startDate: '', endDate: '', description: '' }
      ]
    }));
  };

  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: string) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeWorkExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }));
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await fetch('http://localhost:5000/api/resume/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData)
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedResume(result.resume);
      } else {
        alert('Error generating resume: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate resume. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadResume = (resume: any) => {
    const element = document.createElement('a');
    const file = new Blob([resume.formattedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${resume.personalInfo.name.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="resume-form">
      <h2>Create Your Resume</h2>
      <form onSubmit={handleSubmit}>
        <section className="personal-info">
          <h3>Personal Information</h3>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={resumeData.personalInfo.name}
              onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={resumeData.personalInfo.email}
              onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={resumeData.personalInfo.phone}
              onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={resumeData.personalInfo.location}
              onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
              placeholder="City, State"
              required
            />
          </div>
        </section>

        <section className="work-experience">
          <h3>Work Experience</h3>
          {resumeData.workExperience.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Position</label>
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                    placeholder="Current"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={exp.description}
                  onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                  rows={4}
                  placeholder="Describe your responsibilities and achievements..."
                  required
                />
              </div>
              <button type="button" onClick={() => removeWorkExperience(index)} className="remove-btn">
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addWorkExperience} className="add-btn">
            Add Work Experience
          </button>
        </section>

        <button type="submit" className="generate-btn" disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Resume'}
        </button>
      </form>

      {generatedResume && (
        <section className="resume-preview">
          <h3>Generated Resume Preview</h3>
          <div className="preview-content">
            <pre>{generatedResume.formattedContent}</pre>
          </div>
          <div className="preview-actions">
            <button className="download-btn" onClick={() => downloadResume(generatedResume)}>
              Download Resume
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default ResumeForm;