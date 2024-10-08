import MyInfo from './Assets/myInfo.json';
import Description from './components/Description';
import ProfileInfo from './components/ProfileInfo';
import myPhoto from './Assets/myPhoto.jpg';
import TechSkills from './components/TechSkils';
import WorkExperience from './components/WorkExpetience';
import Socials from './components/Socials';
import Contacts from './components/Contacts';
import Languages from './components/Languages';
import SoftSkills from './components/SoftSkills';
import Education from './components/Education';

function App() {
  return (
    <main className="p-0 m-0 w-full h-full flex justify-center font-play text-black">
      <div className="flex my-10 w-11/12 max-w-[64rem] flex-col shadow-2xl">
        <div className="flex pc700:flex-row flex-col">
          <div className="pc700:w-[40%] w-full flex flex-col items-center">
            <img
              className="pc700:rounded-full object-cover pc700:mt-10 z-10 w-11/12 aspect-square"
              src={myPhoto}
              alt="Profile"
            />
            <div className="w-10/12">
              <ProfileInfo MyInfo={MyInfo} isForSmallScreen />
              <Contacts MyInfo={MyInfo} />
            </div>
            <div className="w-10/12">
              <Socials MyInfo={MyInfo} />
              <Description MyInfo={MyInfo} isForSmallScreen />
              <Languages MyInfo={MyInfo} />
              <TechSkills MyInfo={MyInfo} />
            </div>
          </div>
          <div className="pc700:w-[60%] w-full flex justify-center bg-whiteInherit">
            <div className="w-10/12 flex flex-col pc700:mt-10">
              <ProfileInfo MyInfo={MyInfo} />

              <div className="flex flex-col gap-2 mt-5">
                <div className="pc700:mt-5 flex flex-col">
                  <WorkExperience MyInfo={MyInfo} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <SoftSkills MyInfo={MyInfo} />
        <Education MyInfo={MyInfo} />
      </div>
    </main>
  );
}

export default App;
