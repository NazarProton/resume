import { MyInfoType } from '../types';

const SoftSkills = ({ MyInfo }: { MyInfo: MyInfoType }) => {
  return (
    <div className="mt-5 px-8">
      <h3 className="text-orange-500 text-xl">Soft Skills:</h3>
      <div className="flex flex-wrap gap-2 mt-2">
        {MyInfo.softSkills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-[0.6s]"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SoftSkills;
