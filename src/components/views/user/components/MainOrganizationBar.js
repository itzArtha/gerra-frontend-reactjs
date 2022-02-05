import IconWithTitle from "../../IconWithTitle";
import RoundedButton from "../../../RoundedButton";
import Skeleton from "../../../Skeleton";
import ProfilePicture from "../../../ProfilePicture";
import { Link } from "react-router-dom";

const MainOrganizationBar = ({ data, loading }) => {
  return (
    <>
      <div
        className={`w-full overflow-hidden bg-white rounded-lg dark:bg-gray-800 border border-gray-200`}
      >
        <div className="top px-6 py-4 flex gap-4">
          <div className="profile-picture">
            <ProfilePicture
              link={`/organization/${loading ? "" : data.slug}`}
              transform="w-20 h-20 md:w-32 md:h-32"
              data={data}
              loading={loading}
            />
          </div>
          <div className="detail-information">
            {loading ? (
              <Skeleton className="w-32 h-4 rounded-full" count="1" />
            ) : (
              <Link to={`/organization/${data.slug}`}>
                <h1 className="text-xl text-left font-semibold text-gray-800 dark:text-white">
                  {data.name}
                </h1>
              </Link>
            )}

            <div className="flex items-center mt-4 text-gray-700 dark:text-gray-200">
              {loading ? (
                <Skeleton className="w-24 h-4 rounded-full" count="1" />
              ) : (
                <IconWithTitle
                  title={data.address}
                  loading={loading}
                  icon={
                    <RoundedButton type="button" className="w-8 h-8">
                      <img
                        className="pr-2"
                        src={process.env.PUBLIC_URL + "/pin.svg"}
                        alt="Icon"
                      />
                    </RoundedButton>
                  }
                />
              )}
            </div>

            <div className="flex items-center mt-1 text-gray-700 dark:text-gray-200">
              {loading ? (
                <Skeleton className="w-24 h-4 rounded-full" count="1" />
              ) : (
                <IconWithTitle
                  loading={loading}
                  title={`${data.countSales} Tiket Terjual`}
                  icon={
                    <RoundedButton type="button" className="w-8 h-8">
                      <img
                        className="pr-2"
                        src={process.env.PUBLIC_URL + "/coin-stack.svg"}
                        alt="Icon"
                      />
                    </RoundedButton>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default MainOrganizationBar;
