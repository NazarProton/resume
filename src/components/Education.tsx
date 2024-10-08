import { MyInfoType } from '../types';

const Education = ({ MyInfo }: { MyInfo: MyInfoType }) => {
  return (
    <div className="mt-5 px-8 pb-8">
      <h3 className="text-orange-500 text-xl">Education:</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
        {MyInfo.education.map((edu, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow duration-[0.6s]"
          >
            <h4 className="font-semibold text-md">{edu.institution}</h4>
            <p className="text-sm text-green-700 mt-1">{edu.program}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;
