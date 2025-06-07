// File: app/component/dateTimePicker.tsx

import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
} from 'react-native'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { Ionicons } from '@expo/vector-icons'

interface Event {
  id: string
  description: string
  startTime: string
  endTime: string
}

interface DatePickerProps {
  handleEventChange: (field: keyof Event, value: string) => void
  event: 'startTime' | 'endTime'
  time: string
  /** optional styling wrapper, used in your modal code */
  containerStyle?: object
}

export default function DatePicker({
  handleEventChange,
  event: fieldName,
  time,
  containerStyle,
}: DatePickerProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [mode, setMode] = useState<'date' | 'time'>('date')
  const [tempDate, setTempDate] = useState<Date>(new Date())

  const hasValue = !!time && !isNaN(new Date(time).getTime())
  const currentDate = hasValue ? new Date(time) : new Date()

  const formatDisplayTime = (dateString: string): string => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    const dd = date.getDate().toString().padStart(2, '0')
    const MM = (date.getMonth() + 1).toString().padStart(2, '0')
    const yyyy = date.getFullYear()
    const hh = date.getHours().toString().padStart(2, '0')
    const mm = date.getMinutes().toString().padStart(2, '0')
    return `${hh}:${mm} - ${dd}/${MM}/${yyyy}`
  }

  const getPlaceholderText = () =>
    fieldName === 'startTime' ? 'Start Time' : 'End Time'

  const openPicker = () => {
    setTempDate(currentDate)
    setMode('date')
    setShowPicker(true)
  }

  const onAndroidChange = (pickerEvent: any, selected?: Date) => {
    // android: runs once then dismisses
    if (pickerEvent.type === 'dismissed') {
      setShowPicker(false)
      setMode('date')
      return
    }
    if (!selected) return

    if (mode === 'date') {
      // store date, then open time
      setTempDate(selected)
      setMode('time')
      // keep showPicker true so next render shows time
    } else {
      // final: merge time into tempDate, emit change
      const finalDt = new Date(tempDate)
      finalDt.setHours(selected.getHours(), selected.getMinutes())
      handleEventChange(fieldName, finalDt.toISOString())
      setShowPicker(false)
      setMode('date')
    }
  }

  const onIOSChange = (_: any, selected?: Date) => {
    // iOS spinner mode only updates tempDate
    if (selected) setTempDate(selected)
  }

  const onIOSDone = () => {
    if (mode === 'date') {
      // move to time selection
      setMode('time')
    } else {
      // commit final
      const finalDt = new Date(tempDate)
      handleEventChange(fieldName, finalDt.toISOString())
      setShowPicker(false)
      setMode('date')
    }
  }

  const onIOSCancel = () => {
    setShowPicker(false)
    setMode('date')
  }

  return (
    <View style={containerStyle ?? styles.container}>
      <TouchableOpacity
        onPress={openPicker}
        style={[styles.dateButton, hasValue && styles.dateButtonWithValue]}
      >
        <View style={styles.dateContent}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={hasValue ? '#0061FF' : '#666'}
          />
          <Text
            style={[
              styles.dateText,
              hasValue ? styles.dateTextWithValue : styles.placeholderText,
            ]}
          >
            {hasValue ? formatDisplayTime(time) : getPlaceholderText()}
          </Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color={hasValue ? '#0061FF' : '#666'}
          />
        </View>
      </TouchableOpacity>

      {showPicker && Platform.OS === 'android' && (
        <RNDateTimePicker
          value={tempDate}
          mode={mode}
          display="default"
          onChange={onAndroidChange}
        />
      )}

      {showPicker && Platform.OS === 'ios' && (
        <Modal transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity onPress={onIOSCancel}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.pickerTitle}>
                  {mode === 'date' ? 'Select Date' : 'Select Time'}
                </Text>
                <TouchableOpacity onPress={onIOSDone}>
                  <Text style={styles.doneText}>
                    {mode === 'date' ? 'Next' : 'Done'}
                  </Text>
                </TouchableOpacity>
              </View>
              <RNDateTimePicker
                value={tempDate}
                mode={mode}
                display="spinner"
                onChange={onIOSChange}
                style={{ backgroundColor: '#fff' }}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  dateButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateButtonWithValue: {
    backgroundColor: '#0061FF1A',
    borderColor: '#0061FF40',
  },
  dateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 16,
  },
  dateTextWithValue: {
    color: '#191D31',
    fontWeight: '500',
  },
  placeholderText: {
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  cancelText: {
    color: '#666',
    fontSize: 16,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#191D31',
  },
  doneText: {
    color: '#0061FF',
    fontSize: 16,
    fontWeight: '600',
  },
})
