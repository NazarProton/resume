import MyInfo from '../public/myInfo.json';
import Description from './Description';
import ProfileInfo from './ProfileInfo';
import myPhoto from '../public/myPhoto.jpg';

function App() {
  return (
    <main className="p-0 m-0 w-full h-full flex justify-center font-play text-black">
      <div className="flex my-10 w-11/12 max-w-[64rem] pc700:flex-row flex-col shadow-2xl">
        <div className="pc700:w-[40%] w-full flex flex-col items-center">
          <img
            className="pc700:rounded-full object-cover pc700:mt-10 z-10 w-11/12 aspect-square"
            src={myPhoto}
            alt="Profile"
          />
          <div className="w-10/12">
            <ProfileInfo MyInfo={MyInfo} isForSmallScreen />
            <div className="w-full flex justify-center gap-2 flex-col">
              <h3 className="text-lg">Contacts:</h3>
              <a
                className="hover:opacity-100 opacity-70 flex gap-2"
                href={`tel:${MyInfo.contacts.phone}`}
              >
                <i className="bi bi-telephone-fill"></i>
                {MyInfo.contacts.phone}
              </a>
              <a
                className="hover:opacity-100 opacity-70 flex gap-2"
                href={`mailto:${MyInfo.contacts.email}`}
              >
                <i className="bi bi-envelope"></i>
                {MyInfo.contacts.email}
              </a>
            </div>
          </div>
          <div className="w-10/12">
            <div className="mt-5 w-full flex justify-between gap-2">
              <a
                className="opacity-70 hover:opacity-100 flex gap-2"
                href={MyInfo.contacts.socials.telegram}
              >
                <i className="bi text-3xl bi-telegram"></i>
              </a>
              <a
                className="opacity-70 hover:opacity-100 flex gap-2"
                href={MyInfo.contacts.socials.linkedin}
              >
                <i className="bi text-3xl bi-linkedin"></i>
              </a>
              <a
                className="opacity-70 hover:opacity-100 flex gap-2"
                href={MyInfo.contacts.socials.instagram}
              >
                <i className="bi text-3xl bi-instagram"></i>
              </a>
              <a
                className="opacity-70 hover:opacity-100 flex gap-2"
                href={MyInfo.contacts.socials.github}
              >
                <i className="bi text-3xl bi-github"></i>
              </a>
            </div>
            <div className="mt-5">
              <p className="w-fit text-xl text-orange-500">Languages</p>
              <div className="w-full flex flex-col gap-2">
                {MyInfo.languages.map((lang, index) => (
                  <p
                    key={index}
                    className="flex"
                  >{`${lang.name} - ${lang.level}`}</p>
                ))}
              </div>
            </div>
            <Description MyInfo={MyInfo} isForSmallScreen />

            <div className="mt-5">
              <h3 className="text-orange-500 text-xl">Tech Skills:</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {MyInfo.techSkills.map((skill, index) => (
                  <li key={index} className="whitespace-nowrap">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5">
              <h3 className="text-orange-500 text-xl">Soft Skills:</h3>
              <div className="flex flex-col mt-2 gap-1">
                {MyInfo.softSkills.map((skill, index) => (
                  <span key={index}>{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="pc700:w-[60%] w-full flex justify-center bg-whiteInherit">
          <div className="w-10/12 flex flex-col mt-10">
            <ProfileInfo MyInfo={MyInfo} />
            <div className="flex flex-col gap-2 mt-5">
              <div className="flex flex-col gap-2">
                <div className="mt-5 mb-10 flex flex-col">
                  <div className="mb-10">
                    <h3 className="text-orange-500">
                      Work experience as Developer:
                    </h3>
                    {MyInfo.experience.map((job, index) => (
                      <div key={index} className="mt-2">
                        <h4 className="text-green">{`${job.company} - ${job.position}`}</h4>
                        <p>{job.description}</p>
                        <h5 className="opacity-80">
                          {job.dates} <span className="text-green">|</span>{' '}
                          {job.location}
                        </h5>
                      </div>
                    ))}
                  </div>
                  <h3 className="text-xl text-orange-500">Education:</h3>
                  <div className="mt-2">
                    {MyInfo.education.map((edu, index) => (
                      <div
                        key={index}
                        className="flex flex-wrap items-center mt-2 pc395:gap-2 pc395:flex-row flex-col"
                      >
                        <p>{`${index + 1}) ${edu.institution}`}</p>
                        <p className="text-sm text-green">{edu.program}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
