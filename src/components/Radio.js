const Radio = (props) => {
  return (
    <div>
      <div class="mt-2">
        <label class="inline-flex items-center">
          <input
            type="radio"
            class="form-radio"
            onChange={props.onChange}
            name={props.name}
            value={props.value}
            checked={props.checked}
          />
          <span class="ml-2">{props.label}</span>
        </label>
      </div>
    </div>
  );
};
export default Radio;
