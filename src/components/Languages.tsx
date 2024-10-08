import { MyInfoType } from '../types';

const Languages = ({ MyInfo }: { MyInfo: MyInfoType }) => {
  return (
    <div className="mt-5">
      <p className="w-fit text-xl text-orange-500">Languages:</p>
      <div className="w-full flex flex-col gap-2 mt-2">
        {MyInfo.languages.map((lang, index) => (
          <p key={index} className="flex">{`${lang.name} - ${lang.level}`}</p>
        ))}
      </div>
    </div>
  );
};

export default Languages;
