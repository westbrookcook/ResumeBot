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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Resume Data:', resumeData);
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

        <button type="button" onClick={addWorkExperience} className="add-btn">
          Add Work Experience
        </button>

        <button type="submit" className="generate-btn">
          Generate Resume
        </button>
      </form>
    </div>
  );
};

export default ResumeForm;