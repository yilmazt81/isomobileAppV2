
import React, { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    Portal,
    SegmentedButtons,
    TextInput,
} from "react-native-paper";
import ErrorMessage from "./ErrorMessage";

import { useTranslation } from 'react-i18next';

function DurationDlg({  duration, closeDuration, confirmDuration, defaultDuration, errorMessage }) {
    const [durationDlg, setDurationDlg] = useState(duration);
    const [customSeconds, setCustomSeconds] = useState(String(defaultDuration));

    const { t, i18n } = useTranslation();

    const RunEngine = () => {

        var time = (durationDlg.value == "custom" ? parseInt(customSeconds) : parseInt(durationDlg.value));
        confirmDuration(duration.pump, time);
    }
    useEffect(() => {
        setDurationDlg(duration);
    }, [duration]);
    return (
        <Portal>
            <Dialog visible={duration.open} onDismiss={closeDuration}>
                <Dialog.Icon icon="timer-cog-outline" />
                <Dialog.Title>
                    {duration.pump === 1 ? "Pump 1" : "Pump 2"} {t("Duration")}
                </Dialog.Title>
                <Dialog.Content>
                    <SegmentedButtons
                        value={durationDlg.value}
                        onValueChange={(v) => setDurationDlg((p) => ({ ...p, value: v }))}
                        buttons={[
                            { value: "30", label: "30s" },
                            { value: "60", label: "60s" },
                            { value: "120", label: "120s" },
                            { value: "custom", label: t("Custom") },
                        ]}
                        style={{ marginBottom: 12 }}
                    />
                    {durationDlg.value === "custom" && (
                        <TextInput
                            label={t("Seconds")}
                            mode="outlined"
                            keyboardType="number-pad"
                            value={customSeconds}
                            onChangeText={setCustomSeconds}
                        />
                    )}

                    <ErrorMessage message={errorMessage}></ErrorMessage>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={closeDuration}>{t("Cancel")}</Button>
                    <Button mode="contained" onPress={() => RunEngine()} icon="play">
                        {t("Start")}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

export default DurationDlg;