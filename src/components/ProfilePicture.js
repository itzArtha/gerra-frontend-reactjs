import Skeleton from "./Skeleton";
import { Link } from "react-router-dom";
const ProfilePicture = ({ data, link, transform, loading }) => {
  return (
    <>
      <div
        className={`overflow-hidden ${
          loading ? `` : `border-2 border-gray-400 ${transform}`
        } rounded-full`}
      >
        {loading ? (
          <Skeleton className={`rounded-full ${transform}`} count="1" />
        ) : (
          <Link to={link}>
            <img
              src={
                data.photo_url
                  ? data.photo_url
                  : `https://avatars.dicebear.com/api/bottts/${data.name}.svg`
              }
              className="object-cover w-full h-full"
              alt="avatar"
            />
          </Link>
        )}
      </div>
    </>
  );
};
export default ProfilePicture;
