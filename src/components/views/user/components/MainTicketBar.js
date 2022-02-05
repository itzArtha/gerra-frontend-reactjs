import IconWithTitle from "../../IconWithTitle";
import RoundedButton from "../../../RoundedButton";
import Skeleton from "../../../Skeleton";
import { Link } from "react-router-dom";
import CurrencyFormat from "react-currency-format";

const MainTicketBar = ({ data, loading }) => {
  return (
    <>
      <div
        className={`max-w-sm overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 ${
          loading ? `` : `border border-black`
        }`}
      >
        {loading ? (
          <Skeleton className=" h-56 rounded-md" count="1" />
        ) : (
          <Link to={`/explore/event/${data.slug}`}>
            <img
              className="object-cover object-center w-full h-56"
              src={data.banner_url}
              alt="avatar"
            />
          </Link>
        )}
        {/* {loading ? (
          <Skeleton className="h-12" count="1" />
        ) : (
          <div className="flex items-center px-2 py-3 bg-gray-900">
            <h1 className="mx-3 text-lg font-semibold text-white">
              {data.title}
            </h1>
          </div>
        )} */}

        <div className={`px-6 py-4 ${loading ? `` : `border-t border-black`}`}>
          {loading ? (
            <Skeleton className="w-32 h-4 rounded-full" count="1" />
          ) : (
            <Link to={`/explore/event/${data.slug}`}>
              <h1 className="text-xl text-left font-semibold text-gray-800 dark:text-white">
                {data.title.substring(0, 15) +
                  " " +
                  (data.title.length > 15 ? "..." : "")}
              </h1>
            </Link>
          )}
          {loading ? (
            <Skeleton className="w-1/2 h-4 rounded-full" count="1" />
          ) : (
            <div className="my-2">
              <h2 className="text-left text-sm font-semibold text-blue-500">
                {data.format} | {data.is_online ? "Online" : "Offline"}
              </h2>
            </div>
          )}
          <div className="flex items-center text-sm mt-4 text-gray-700 dark:text-gray-200">
            <Link to={`/${loading ? `` : data.owner_username}`}>
              <IconWithTitle
                title={
                  loading
                    ? ""
                    : data.owner.substring(0, 12) +
                      " " +
                      (data.owner.length > 12 ? "..." : "")
                }
                loading={loading}
                icon={
                  <img
                    className="w-8 h-8 rounded-full object-cover"
                    src={loading ? "" : data.photo_url}
                    alt="Icon"
                  />
                }
              />
            </Link>
          </div>

          <div className="flex items-center text-sm mt-1 text-gray-700 dark:text-gray-200">
            {/* <IconWithTitle
              loading={loading}
              title={
                <CurrencyFormat
                  value={loading ? 0 : data.price}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"Rp"}
                />
              }
              icon={
                <RoundedButton type="button" className="w-8 h-8">
                  <img
                    className="pr-2"
                    src={process.env.PUBLIC_URL + "/coin-stack.svg"}
                    alt="Icon"
                  />
                </RoundedButton>
              }
            /> */}
          </div>
        </div>
      </div>
    </>
  );
};
export default MainTicketBar;
