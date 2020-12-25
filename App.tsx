import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image, ActivityIndicator, ScrollView } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import axios from 'axios'

export default function App () {
  const [hasPermission, setHasPermission] = useState(false)
  const [barCodeData, setBarCodeData] = useState(null)
  const [scanned, setScanned] = useState(false)

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  if (hasPermission === false) {
    return <SafeAreaView>
      <Text>No access to the camera</Text>
    </SafeAreaView>
  }

  const handleBarCodeScanned = async ({ data }: any) => {
    setScanned(true)

    try {
      const response = await axios.get('https://barcode.monster/api/' + data)
      if (response.data.status !== 'active') {
        setScanned(false)
        alert('Invalid barcode.')
      } else {
        setBarCodeData(response.data)
      }
    } catch (ex) {
      setScanned(false)
      alert('Error occured while fetching information. Please try again.')
    }
  }

  const scanAgain = () => {
    setScanned(false)
    setBarCodeData(null)
  }

  return (
    <View style={styles.container}>
      {
        scanned
          ? <SafeAreaView style={{ flex: 1 }}>
          {
            barCodeData !== null
              ? <ScrollView>
              <Image
                source={{
                  uri: barCodeData.image_url
                }}
                resizeMode="contain"
                style={styles.image}
              />
              {
                barCodeData.class.length &&
                <View style={styles.item}>
                  <Text style={styles.title}>Class</Text>
                  <Text style={styles.data}>{barCodeData.class}</Text>
                </View>
              }
              {
                barCodeData.code.length &&
                <View style={styles.item}>
                  <Text style={styles.title}>Code</Text>
                  <Text style={styles.data}>{barCodeData.code}</Text>
                </View>
              }
              {
                barCodeData.company.length > 0 &&
                <View style={styles.item}>
                  <Text style={styles.title}>Company</Text>
                  <Text style={styles.data}>{barCodeData.company}</Text>
                </View>
              }
              {
                barCodeData.description.length > 0 &&
                <View style={styles.item}>
                  <Text style={styles.title}>Description</Text>
                  <Text style={styles.data}>{barCodeData.description}</Text>
                </View>
              }
              {
                barCodeData.size.length > 0 &&
                <View style={styles.item}>
                  <Text style={styles.title}>Size</Text>
                  <Text style={styles.data}>{barCodeData.size}</Text>
                </View>
              }
              {
                barCodeData.status.length > 0 &&
                <View style={styles.item}>
                  <Text style={styles.title}>Status</Text>
                  <Text style={styles.data}>{barCodeData.status}</Text>
                </View>
              }

              <TouchableOpacity onPress={scanAgain} style={styles.appButtonContainer}>
                <Text style={styles.appButtonText}>Scan Again</Text>
              </TouchableOpacity>
            </ScrollView>
              : <ActivityIndicator size="large" style={styles.indicator} color="#0000ff"/>
          }
        </SafeAreaView>
          : <View style={{ flex: 1 }}>
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.label}>Scan your barcode</Text>
        </View>
      }

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  fill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 16,
    marginBottom: 16
  },
  item: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    padding: 8
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8
  },
  data: {
    fontSize: 12,
    color: 'grey'
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 16
  },
  appButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase'
  },
  indicator: {
    marginTop: 32
  },
  label: {
    marginTop: 42,
    fontSize: 24,
    textAlign: 'center',
    color: 'red'
  }
})
