import React from "react";

const PasswordStrengthIndicator = ({validity: {minChar, number, specialChar}}) => {
    return (
        <div className="password-meter text-left mb-4">
            <p className="text-dark">Hasło musi zawierać</p>
            <ul className="text-muted">
                <PasswordStrengthIndicatorItem isValid={minChar} text="Minimum 8 znaków"/>
                <PasswordStrengthIndicatorItem isValid={number} text="Przynajmniej jedną cyfrę"/>
                <PasswordStrengthIndicatorItem isValid={specialChar} text="Przynajmniej jeden znak specjlny"/>
            </ul>
        </div>
    );
};

const PasswordStrengthIndicatorItem = ({isValid, text}) =>{
    const highlightClass = isValid ? "text-success" : isValid !== null ? "text-danger" : ""
    return <li className={highlightClass}>{text}{highlightClass==="text-success" ? <>&#10004;&#65039;</> : <></>}</li>
}

export default PasswordStrengthIndicator