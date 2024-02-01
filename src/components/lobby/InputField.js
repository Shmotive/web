import Button from "react-bootstrap/Button";
export default function InputField({
  inputPlaceholder = "cafe, pizza, burgers...",
  buttonLabel = "Add Suggestion",
  onClick = () => {},
}) {
  return (
    <>
      <div className="input-field-container">
        <input
          className="suggestion-input"
          placeholder={inputPlaceholder}
        ></input>
        <Button
          className="suggestion-button suggestion-input"
          variant="secondary"
          size="lg"
          onClick={onClick}
        >
          {buttonLabel}
        </Button>
      </div>
    </>
  );
}
