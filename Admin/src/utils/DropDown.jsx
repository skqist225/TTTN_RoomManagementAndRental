import { FloatingLabel, Form } from "react-bootstrap";

export default function DropDown({ label, fieldName, register, options, defaultValue, id }) {
    return (
        <>
            {options.length && (
                <FloatingLabel label={label} style={{ margin: "20px 0" }}>
                    <Form.Select {...register(fieldName)} defaultValue={defaultValue} id={id}>
                        {options.map(({ value, displayText }) => (
                            <option value={value} key={value}>
                                {displayText}
                            </option>
                        ))}
                    </Form.Select>
                </FloatingLabel>
            )}
        </>
    );
}
