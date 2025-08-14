
import React, { useState } from "react";
import {
    Button,
    Dialog,
    Portal,
    SegmentedButtons,
    TextInput,
} from "react-native-paper";

import { useTranslation } from 'react-i18next';

function DurationDlg({durationvisible, duration, closeDuration, confirmDuration, defaultDuration }) {
    const [durationDlg, setDurationDlg] = useState(duration);
    const [customSeconds, setCustomSeconds] = useState(String(defaultDuration));

    const { t, i18n } = useTranslation();
    
    const handleSave = () => {

    };

    return (
        <Portal>
            <Dialog visible={durationvisible} onDismiss={closeDuration}>
                <Dialog.Icon icon="timer-cog-outline" />
                <Dialog.Title>
                    {durationDlg.pump === 1 ? "Pump 1" : "Pump 2"} {t("Duration")}
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
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={closeDuration}>{t("Cancel")}</Button>
                    <Button mode="contained" onPress={confirmDuration} icon="play">
                        {t("Start")}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

export default DurationDlg;