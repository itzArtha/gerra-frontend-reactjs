const Checkbox = (props) => {
  return (
    <>
      <div className="p-2">
        <label className="inline-flex items-center font-normal text-xl">
          <input
            className="text-yellow-400 w-6 h-6 mr-2 focus:ring-yellow-300 focus:ring-opacity-25 border border-gray-300 rounded"
            type="checkbox"
            id={props.id}
            value={props.value}
            name={props.name}
            onChange={props.onChange}
            checked={props.checked}
            title={props.title}
          />
          {props.label}
        </label>
      </div>
    </>
  );
};
export default Checkbox;
