import MainInput from "./MainInput";
import SelectInput from "./SelectInput";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import MainButton from "./MainButton";
import ErrorLabel from "./ErrorLabel";

const MainSearchBarWithSelect = ({ searchCallback, lastPath }) => {
  const [search, setSearch] = useState();
  const [error, setError] = useState(false);
  const history = useHistory();
  const handleCallback = () => {
    search ? searchCallback(search) : setError(true);
  };
  return (
    <>
      <div className="seacrh-bar mb-4">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          <div className="col-span-1">
            <SelectInput
              onChange={(e) => {
                history.push(e.target.value);
              }}
              value={lastPath}
            >
              <option value="event">Event</option>
              <option value="organization">Organisasi</option>
            </SelectInput>
          </div>
          <div className="col-span-2 md:col-span-3">
            <div className="flex gap-2">
              <MainInput
                placeholder="Cari..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setError(false);
                }}
                onKeyPress={(e) => {
                  if (e.keyCode === 13) {
                    handleCallback();
                  }
                }}
              />
              <MainButton onClick={handleCallback} type="button" label="S" />
            </div>
            {error ? (
              <ErrorLabel label="Yaa ketik dulu dong anj, masa main search gitu aja :)" />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default MainSearchBarWithSelect;
