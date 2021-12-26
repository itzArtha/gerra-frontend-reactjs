const Skeleton = (props) => {
  const createTable = () => {
    let children = [];
    for (let i = 0; i < props.count; i++) {
      children.push(
        <div key={i} className="animate-pulse space-x-4">
          <div className="flex-1 space-y-1 py-1">
            <div className={`bg-gray-300 ${props.className}`}></div>
          </div>
        </div>
      );
    }

    return children;
  };
  return <>{createTable()}</>;
};
export default Skeleton;
