import MainButton from "../../../MainButton";
import RoundedButton from "../../../RoundedButton";
import IconWithTitle from "../../IconWithTitle";
import Skeleton from "../../../Skeleton";
import { Link } from "react-router-dom";

const SecondTicketBar = ({ data, loading }) => {
  return (
    <>
      <div
        className={`flex w-full overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 ${
          loading ? `` : `border border-black`
        }`}
      >
        {loading ? (
          <Skeleton className="w-48 h-32 rounded" count="1" />
        ) : (
          <div
            className="w-1/3 bg-cover"
            style={{
              backgroundImage: `url(${data.banner_url})`,
            }}
          ></div>
        )}

        <div className="w-2/3 p-4 md:p-4">
          {loading ? (
            <Skeleton className="w-52 h-4 rounded-full" count="1" />
          ) : (
            <h1 className="mb-1 text-2xl font-semibold text-gray-800 dark:text-white text-left capitalize">
              {data.title}
            </h1>
          )}
          <IconWithTitle
            loading={loading}
            title={loading ? "" : data.owner}
            icon={
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={loading ? 0 : data.photo_url}
                alt="Icon"
              />
            }
          />
          <div className="flex justify-between">
            <IconWithTitle
              loading={loading}
              title={`Rp${loading ? 0 : data.price}`}
              icon={
                <RoundedButton
                  type="button"
                  className="w-8 h-8"
                  icon={process.env.PUBLIC_URL + "/coin-stack.svg"}
                />
              }
            />

            {loading ? (
              <Skeleton className="w-16 h-10 rounded-lg" count="1" />
            ) : (
              <Link to={`event/${data.slug}`}>
                <MainButton type="button" label="Beli" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default SecondTicketBar;
