export type MyInfoType = {
  profile: {
    name: string;
    title: string;
    age: number;
    location: string;
    description: string;
    description2: string;
    description3: string;
    description4: string;
    description5: string;
  };
  contacts: {
    phone: string;
    email: string;
    socials: {
      telegram: string;
      linkedin: string;
      instagram: string;
      github: string;
    };
  };
  languages: Array<{
    name: string;
    level: string;
  }>;
  techSkills: {
    frontend: string[];
    backend: string[];
    blockchain: string[];
    tools: string[];
    librariesUIFrameworks: string[];
  };
  softSkills: string[];
  experience: Array<{
    company: string;
    position: string;
    description: string;
    dates?: string;
    location?: string;
    link?: string;
    projects?: Array<{
      name: string;
      description: string;
      dates?: string;
      location?: string;
      link?: string;
    }>;
  }>;
  education: Array<{
    institution: string;
    program: string;
  }>;
};
