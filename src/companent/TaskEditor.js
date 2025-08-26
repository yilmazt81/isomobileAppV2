
import React, { useMemo, useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Platform } from "react-native";
import {
  Appbar,
  Avatar,
  Button,
  Card,
  Chip,
  Dialog,
  Divider,
  FAB,
  IconButton,
  Menu,
  Modal,
  Portal,
  Searchbar,
  SegmentedButtons,
  Switch,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

import styles from './TaskEditorStyle'; // Adjust the import path as necessary


function TaskEditor({ visible, onDismiss, onSave, initial, t, pomp, defaultDuration }) {
  const { colors } = useTheme();

  const [enabled, setEnabled] = useState(initial?.enabled ?? true);
  const [nextRun, setNextRun] = useState(initial?.nextRun ?? new Date());
  const [durationDlg, setDurationDlg] = useState({ value: "" });
  const [customSeconds, setcustomSeconds] = useState("150");

  const [repeatType, setRepeatType] = useState(
    initial?.repeat?.type ?? "daily"
  );
  const [weeklyDays, setWeeklyDays] = useState(
    initial?.repeat?.type === "weekly" ? [...(initial.repeat.days || [])] : [1]
  );
  const [monthlyDay, setMonthlyDay] = useState(
    initial?.repeat?.type === "monthly" ? initial.repeat.day : 1
  );

  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [enableDate, setEnableDate] = useState(true);

  const repeat = useMemo(() => {
    if (repeatType === "weekly") return { type: "weekly", days: weeklyDays };
    if (repeatType === "monthly") return { type: "monthly", day: monthlyDay };
    if (repeatType === "once") return { type: "once" };
    return { type: "daily" };
  }, [repeatType, weeklyDays, monthlyDay]);


  const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
  const formatDateTime = (d) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  /*
    const repeatToLabel = (r) => {
      if (!r) return "—";
      switch (r.type) {
        case "once":
          return "Once";
        case "daily":
          return "Daily";
        case "weekly":
          return `Weekly • ${(r.days || [])
            .slice()
            .sort()
            .map((n) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][n])
            .join("/")}`;
        default:
          return "—";
      }
    };
  */
  const weekDays = [t("Sun"), t("Mon"), t("Tue"), t("Wed"), t("Thu"), t("Fri"), t("Sat")];



  useEffect(() => {
    setEnabled(initial?.enabled ?? true);
    setNextRun(initial?.nextRun ?? new Date());
    if (initial?.durationValue > 120) {
      setDurationDlg({ value: "custom", });
      setcustomSeconds(initial?.durationValue);
    } else {
      setDurationDlg({ value: initial?.durationValue.toString() });
    }
 
    setRepeatType(initial?.repeat?.type ?? "daily");
    setWeeklyDays(
      initial?.repeat?.type === "weekly" ? [...(initial.repeat.days || [])] : [1]
    )
  }, [initial]);

  const handleSave = () => {

    var durationValue = 0;
    if (durationDlg.value === "custom") {
      durationValue = customSeconds;
    } else {
      durationValue = parseInt(durationDlg.value);
    }
    const task = {
      pompnumber: pomp,
      enabled,
      nextRun,
      repeat,
      durationValue,
    };

    onSave(task);
    onDismiss();
  };

  const changedRepeatType = (v) => {
    setRepeatType(v);
    setEnableDate(v === "once");

  }
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Text variant="titleLarge" style={{ marginBottom: 12 }}>
          {pomp} {t("PompTask")}
        </Text>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Button mode="outlined" onPress={() => setShowDate(true)} icon="calendar">
            {formatDateTime(nextRun).split(" ")[0]}
          </Button>
          <Button
            mode="outlined"
            onPress={() => setShowTime(true)}
            icon="clock-outline"
          >
            {formatDateTime(nextRun).split(" ")[1]}
          </Button>
          <View style={{ flex: 1 }} />

        </View>

        {showDate && (
          <DateTimePicker
            value={nextRun}
            mode="date"
            enabled={enableDate}
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={(e, d) => {
              setShowDate(false);
              if (d)
                setNextRun((prev) =>
                  new Date(
                    d.getFullYear(),
                    d.getMonth(),
                    d.getDate(),
                    prev.getHours(),
                    prev.getMinutes()
                  )
                );
            }}
          />
        )}
        {showTime && (
          <DateTimePicker
            value={nextRun}
            mode="time"
            display="default"
            onChange={(e, d) => {
              setShowTime(false);
              if (d)
                setNextRun((prev) =>
                  new Date(
                    prev.getFullYear(),
                    prev.getMonth(),
                    prev.getDate(),
                    d.getHours(),
                    d.getMinutes()
                  )
                );
            }}
          />
        )}

        <Text style={{ marginTop: 12, marginBottom: 6 }} variant="titleSmall">
          {t("Repeat")}
        </Text>
        <SegmentedButtons
          value={repeatType}
          onValueChange={(v) => changedRepeatType(v)}
          buttons={[
            { value: "once", label: t("Ones") },
            { value: "daily", label: t("Daily") },
            { value: "weekly", label: t("Weekly") },
          ]}
          style={{ marginBottom: 10 }}
        />

        {repeatType === "weekly" && (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
            {weekDays.map((d, idx) => {
              const selected = weeklyDays.includes(idx);
              return (
                <Chip
                  key={idx}
                  selected={selected}
                  onPress={() =>
                    setWeeklyDays((prev) =>
                      selected ? prev.filter((x) => x !== idx) : [...prev, idx]
                    )
                  }
                >
                  {d}
                </Chip>
              );
            })}
          </View>
        )}
        <Text style={{ marginTop: 12, marginBottom: 6 }} variant="titleSmall">
          {t("Duration")}
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>

          <SegmentedButtons
            value={durationDlg?.value}
            onValueChange={(v) => setDurationDlg((p) => ({ ...p, value: v }))}
            buttons={[
              { value: "30", label: "30s" },
              { value: "60", label: "60s" },
              { value: "120", label: "120s" },
              { value: "custom", label: t("Custom") },
            ]}
            style={{ marginBottom: 12 }}
          />

        </View>
        <View style={{ marginTop: 12, marginBottom: 6 }}>
          {durationDlg?.value === "custom" && (
            <TextInput
              label={t("Seconds")}
              mode="outlined"
              keyboardType="number-pad"
              value={customSeconds}
              onChangeText={setcustomSeconds}
            />
          )}
        </View>


        <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 6 }}>
          <Button onPress={onDismiss}>{t("Cancel")}</Button>
          <Button mode="contained" onPress={handleSave} icon="content-save">
            {t("Save")}
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

export default TaskEditor;