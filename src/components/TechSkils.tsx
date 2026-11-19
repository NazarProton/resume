import { MyInfoType, ResumeUiText } from '../types';

const GROUPS = ['frontend', 'backend', 'ai', 'blockchain', 'tools'] as const;

function TechSkills({ MyInfo, labels }: { MyInfo: MyInfoType; labels: ResumeUiText['tech'] }) {
  return (
    <section className="resume-skills">
      <h2>{labels.title}</h2>
      <div className="resume-skill-groups">
        {GROUPS.map((group) => {
          const skills = MyInfo.techSkills[group] ?? [];
          return skills.length ? (
            <div className="resume-skill-group" key={group}>
              <h3>{labels[group]}</h3>
              <p>{skills.join(' · ')}</p>
            </div>
          ) : null;
        })}
      </div>
    </section>
  );
}

export default TechSkills;
