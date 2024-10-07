import Description from './Description';
import { MyInfoType } from './types';

const ProfileInfo = ({
  MyInfo,
  isForSmallScreen,
}: {
  MyInfo: MyInfoType;
  isForSmallScreen?: boolean;
}) => {
  return (
    <div
      className={`${
        isForSmallScreen
          ? 'pc700:hidden flex flex-col my-5'
          : 'pc700:flex hidden flex-col'
      }`}
    >
      <p>{MyInfo.profile.title}</p>
      <p className="text-4xl">{MyInfo.profile.name}</p>
      <p className="text-lg">
        {MyInfo.profile.age}y.o. {MyInfo.profile.location}
      </p>
      {!isForSmallScreen && <Description MyInfo={MyInfo} />}
    </div>
  );
};

export default ProfileInfo;
