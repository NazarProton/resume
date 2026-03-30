import { MyInfoType } from '../types';

const SoftSkills = ({ MyInfo, title }: { MyInfo: MyInfoType; title: string }) => {
  return (
    <div className="mt-5">
      <h3 className="text-orange-500 text-xl">{title}</h3>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {MyInfo.softSkills.map((skill, index) => (
          <li key={index} className="whitespace-nowrap">
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SoftSkills;
