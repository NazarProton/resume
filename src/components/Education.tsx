import { MyInfoType } from '../types';

const Education = ({ MyInfo }: { MyInfo: MyInfoType }) => {
  return (
    <div className="mt-5 pb-8">
      <h3 className="text-orange-500 text-xl">Education:</h3>
      <div className="flex flex-col gap-4 mt-3">
        {MyInfo.education.map((edu, index) => (
          <div key={index} className="">
            <h4 className="font-semibold">{edu.institution}</h4>
            <p className="mt-1">{edu.program}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;
