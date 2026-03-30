import { MyInfoType } from '../types';

const TechSkills = ({
  MyInfo,
  labels,
}: {
  MyInfo: MyInfoType;
  labels: {
    title: string;
    frontend: string;
    backend: string;
    blockchain: string;
    tools: string;
  };
}) => {
  return (
    <div className="mt-5">
      <h3 className="text-orange-500 text-xl">{labels.title}</h3>
      <div className="mt-2 flex flex-col gap-4">
        <div>
          <h4 className="font-semibold text-lg">{labels.frontend}</h4>
          <ul className="flex flex-wrap gap-1.5">
            {MyInfo.techSkills.frontend.map((skill, index) => (
              <li key={index} className="whitespace-nowrap">
                {skill}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-lg">{labels.backend}</h4>
          <ul className="flex flex-wrap gap-1.5">
            {MyInfo.techSkills.backend.map((skill, index) => (
              <li key={index} className="whitespace-nowrap">
                {skill}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-lg">{labels.blockchain}</h4>
          <ul className="flex flex-wrap gap-1.5">
            {MyInfo.techSkills.blockchain.map((skill, index) => (
              <li key={index} className="whitespace-nowrap">
                {skill}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-lg">{labels.tools}</h4>
          <ul className="flex flex-wrap gap-1.5">
            {MyInfo.techSkills.tools.map((skill, index) => (
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
