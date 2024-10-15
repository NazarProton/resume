export type MyInfoType = {
  profile: {
    name: string;
    title: string;
    description: string;
  };
  contacts: {
    location: string;
    locationLink: string;
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
  };
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
