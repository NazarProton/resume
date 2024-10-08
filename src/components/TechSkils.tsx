import { MyInfoType } from '../types';

const TechSkills = ({ MyInfo }: { MyInfo: MyInfoType }) => {
  return (
    <div className="mt-5">
      <h3 className="text-orange-500 text-xl">Tech Skills:</h3>
      <div className="mt-2 flex flex-col gap-4">
        <div>
          <h4 className="font-semibold text-lg">Frontend:</h4>
          <ul className="flex flex-wrap gap-1.5">
            {MyInfo.techSkills.frontend.map((skill, index) => (
              <li key={index} className="whitespace-nowrap">
                {skill}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-lg">Backend:</h4>
          <ul className="flex flex-wrap gap-1.5">
            {MyInfo.techSkills.backend.map((skill, index) => (
              <li key={index} className="whitespace-nowrap">
                {skill}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-lg">Blockchain:</h4>
          <ul className="flex flex-wrap gap-1.5">
            {MyInfo.techSkills.blockchain.map((skill, index) => (
              <li key={index} className="whitespace-nowrap">
                {skill}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-lg">Tools:</h4>
          <ul className="flex flex-wrap gap-1.5">
            {MyInfo.techSkills.tools.map((skill, index) => (
              <li key={index} className="whitespace-nowrap">
                {skill}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-lg">Libraries/UI Frameworks:</h4>
          <ul className="flex flex-wrap gap-1">
            {MyInfo.techSkills.librariesUIFrameworks.map((skill, index) => (
              <li key={index} className="whitespace-nowrap">
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TechSkills;
