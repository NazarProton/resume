import Description from './Description';
import { MyInfoType } from '../types';

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
      <p className="text-5xl">{MyInfo.profile.name}</p>
      <p>{MyInfo.profile.title}</p>
      {!isForSmallScreen && <Description MyInfo={MyInfo} />}
    </div>
  );
};

export default ProfileInfo;
