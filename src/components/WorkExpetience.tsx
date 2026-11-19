import { MyInfoType } from '../types';

function WorkExperience({ MyInfo, labels }: {
  MyInfo: MyInfoType;
  labels: { title: string; projectsAt: string };
}) {
  return (
    <section>
      <h2>{labels.title}</h2>
      {MyInfo.experience.map((job) => (
        <section className="resume-job" key={`${job.company}-${job.dates}`}>
          <h3>{job.link ? <a href={job.link}>{job.company}</a> : job.company}</h3>
          <p className="resume-job-title">{job.position}</p>
          <p className="resume-job-meta">{[job.dates, job.location].filter(Boolean).join(' | ')}</p>
          {job.description.includes('\n') ? (
            <ul className="resume-highlights">
              {job.description.split('\n').filter(Boolean).map((line) => <li key={line}>{line}</li>)}
            </ul>
          ) : <p>{job.description}</p>}
          {job.projects?.length ? (
            <div className="resume-projects">
              <h4>{labels.projectsAt} {job.company}</h4>
              {job.projects.map((project) => (
                <div key={project.name}>
                  <h4>{project.link ? <a href={project.link}>{project.name}</a> : project.name}</h4>
                  <p className="resume-job-meta">{[project.dates, project.location].filter(Boolean).join(' | ')}</p>
                  <p>{project.description}</p>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ))}
    </section>
  );
}

export default WorkExperience;
