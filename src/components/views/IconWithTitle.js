import Skeleton from "../Skeleton";

const IconWithTitle = (props) => {
  return (
    <>
      <div className={`flex ${props.className}`}>
        {props.loading ? (
          <Skeleton className="w-8 h-8 rounded-full" count="1" />
        ) : (
          props.icon
        )}
        {props.loading ? (
          <Skeleton className="w-24 h-4 rounded-full ml-2 mt-2" count="1" />
        ) : (
          <h1 className="mx-2 font-normal text-gray-700 dark:text-gray-200 text-xl py-1 capitalize">
            {props.title}
          </h1>
        )}
      </div>
    </>
  );
};
export default IconWithTitle;
