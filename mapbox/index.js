import React, { Component } from 'react'
import { Text, View, Platform, StyleSheet } from 'react-native'

import Mapbox from '@mapbox/react-native-mapbox-gl'

const IS_ANDROID = Platform.OS === 'android';
const DEFAULT_CENTER_COORDINATE = [-77.036086, 38.910233];
const SF_OFFICE_COORDINATE = [-122.400021, 37.789085];

export default class index extends Component {
  constructor(props) {
    super(props);

    this.onRegionDidChange = this.onRegionDidChange.bind(this);
    this.onRegionWillChange = this.onRegionWillChange.bind(this);
    // this.onDidFinishLoadingMap = this.onDidFinishLoadingMap.bind(this);
  }

  state = {
    isFetchingAndroidPermission: IS_ANDROID,
    isAndroidPermissionGranted: false,
    reason: '',
    regionFeature: undefined,
  }

  async componentWillMount() {
    if (IS_ANDROID) {
      const isGranted = await Mapbox.requestAndroidLocationPermissions();
      this.setState({
        isAndroidPermissionGranted: isGranted,
        isFetchingAndroidPermission: false,
      });
    }
  }

  onDidFinishLoadingMap = async () => {
    const visibleBounds = await this.map.getVisibleBounds();
    console.log('Visible Bounds', visibleBounds); // eslint-disable-line no-console
  }

  onRegionWillChange(regionFeature) {
    console.log('onRegionWillChange', regionFeature); // eslint-disable-line no-console
    this.setState({ reason: 'will change', regionFeature: regionFeature });
  }

  onRegionDidChange(regionFeature) {
    console.log('onRegionDidChange', regionFeature); // eslint-disable-line no-console
    this.setState({ reason: 'did change', regionFeature: regionFeature });
  }

  render() {
    if (IS_ANDROID && !this.state.isAndroidPermissionGranted) {
      if (this.state.isFetchingAndroidPermission) {
        return null;
      }
      return (
        <View style={{ flex: 1, }}>
          <Text style={styles.noPermissionsText}>
            You need to accept location permissions in order to use this example
            applications
          </Text>
        </View>
      )
    }

    return (
      <Mapbox.MapView
        style={StyleSheet.absoluteFillObject}
        ref={(c) => (this.map = c)}
        showUserLocation={true}
        onUserTrackingModeChange={() => console.log('onUserTrackingModeChange')}
        centerCoordinate={DEFAULT_CENTER_COORDINATE}
        onDidFinishLoadingMap={() => this.onDidFinishLoadingMap()}
        onRegionWillChange={this.onRegionWillChange}
        onRegionDidChange={this.onRegionDidChange}
        styleURL={Mapbox.StyleURL.Dark}
        onLongPress={() => console.log('on long press')}
      />
    );

  }
}

const styles = StyleSheet.create({

  noPermissionsText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    marginTop: 48,
    fontSize: 24,
    textAlign: 'center',
  },
  exampleList: {
    flex: 1,
    marginTop: 60 + 12, // header + list padding,
  },
  exampleListItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  exampleListItem: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exampleListLabel: {
    fontSize: 18,
  },
  exampleBackground: {
    flex: 1,
    backgroundColor: 'pink',
  },
});
