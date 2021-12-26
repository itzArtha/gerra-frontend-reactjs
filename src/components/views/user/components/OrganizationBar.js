import Skeleton from "../../../Skeleton";

const OrganizationBar = ({ data, loading }) => {
  return (
    <>
      {loading ? (
        <Skeleton className="rounded-full w-36 h-36" count={1} />
      ) : (
        <div
          className="w-36 h-36 bg-cover rounded-full border border-black"
          style={{
            backgroundImage: `url(${data.photo_url})`,
          }}
        ></div>
      )}
    </>
  );
};
export default OrganizationBar;
