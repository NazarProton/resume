import { MyInfoType } from '../types';

const WorkExperience = ({ MyInfo }: { MyInfo: MyInfoType }) => {
  return (
    <div className="">
      <h3 className="text-orange-500 text-xl">Work experience as Developer:</h3>
      {MyInfo.experience.map((job, index) => (
        <div key={index} className="mt-2">
          <a
            className="flex gap-2 font-bold group items-center"
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{`${job.company} - ${job.position}`}</span>

            {!job.projects ? (
              job.link ? (
                <i className="bi bi-box-arrow-up-right text-green group-hover:rotate-[45deg] transition-all will-change-transform duration-[0.6s]"></i>
              ) : (
                <i className="bi bi-database-x text-orange-700"></i>
              )
            ) : (
              ''
            )}
          </a>
          {!job.projects && (
            <h5 className="opacity-80">
              {job.dates} <span className="text-green">|</span> {job.location}
            </h5>
          )}

          <p>{job.description}</p>
          {job.projects && job.projects.length > 0 && (
            <div className="ml-4 mt-2">
              <h1 className="text-green text-lg">Projects at {job.company}:</h1>
              {job.projects.map((project, pIndex) => (
                <div key={pIndex} className="mt-2">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-2 font-semibold group items-center"
                  >
                    <span>{project.name}</span>
                    {project.link ? (
                      <i className="bi bi-box-arrow-up-right text-green group-hover:rotate-[45deg] transition-all will-change-transform duration-[0.6s]"></i>
                    ) : (
                      <i className="bi bi-database-x text-orange-700"></i>
                    )}
                    <span className="opacity-80">
                      {project.dates} <span className="text-green">|</span>{' '}
                      {project.location}
                    </span>
                  </a>
                  <p>{project.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default WorkExperience;
