import React, { useRef, useState } from "react";
import {
    View,
    TextInput,
    StyleSheet,
} from "react-native";

export default function OTPInputs({ code, setCode }) {
    const inputs = Array(6).fill(0);
    const inputRefs = useRef([]);

    const handleChange = (text, index) => {
        if (/^\d?$/.test(text)) {
            const newCode = code.split("");
            newCode[index] = text;
            setCode(newCode.join(""));

            // Move to next input
            if (text && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
            const newCode = code.split("");
            newCode[index - 1] = "";
            setCode(newCode.join(""));
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <View style={styles.otpContainer}>
            {inputs.map((_, i) => (
                <TextInput
                    key={i}
                    ref={(ref) => (inputRefs.current[i] = ref)}
                    value={code[i] || ""}
                    onChangeText={(text) => handleChange(text, i)}
                    onKeyPress={(e) => handleKeyPress(e, i)}
                    maxLength={1}
                    keyboardType="number-pad"
                    style={styles.otpInput}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        gap: 10,
    },
    otpInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        textAlign: "center",
        fontSize: 24,
        padding: 12,
        width: 48,
    },
});
