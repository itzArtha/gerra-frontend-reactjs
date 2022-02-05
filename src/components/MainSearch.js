import MainInput from "./MainInput";
import { useState } from "react";
import MainButton from "./MainButton";
import ErrorLabel from "./ErrorLabel";

const MainSearch = ({ searchCallback, placeholder }) => {
  const [search, setSearch] = useState();
  const [error, setError] = useState(false);

  const handleCallback = () => {
    search ? searchCallback(search) : setError(true);
  };
  return (
    <>
      <div className="seacrh-bar mb-4">
        <div className="col-span-2 md:col-span-3">
          <div className="flex gap-2">
            <MainInput
              placeholder={placeholder}
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
            <MainButton
              onClick={handleCallback}
              type="button"
              label={
                <img
                  className="w-4 h-4"
                  src={process.env.PUBLIC_URL + "/search.svg"}
                  alt="Icon"
                />
              }
            />
          </div>
          {error ? (
            <ErrorLabel label="Yaa ketik dulu dong anj, masa main search gitu aja :)" />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};
export default MainSearch;
