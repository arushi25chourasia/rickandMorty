import React, {useEffect} from 'react';
import {Text, View, ScrollView, StyleSheet, FlatList} from 'react-native';
import {Card} from 'react-native-elements';

const GroupField = ({char, field, label}) => {
  const arr = field.split('.');
  const val =
    typeof char[arr[0]] === 'object' ? char[arr[0]][arr[1]] : char[arr[0]];

  return (
    <View>
      <Card.FeaturedTitle style={{color: 'black'}}>{label}</Card.FeaturedTitle>
      <Card.FeaturedSubtitle style={{color: 'black'}}>
        {val}
      </Card.FeaturedSubtitle>
    </View>
  );
};

const OriginGroup = ({label, location, item, labelKey}) => {
  const val = location.filter(id => id.char_id === item.id)[0]?.[labelKey];
  return (
    <View style={{flexDirection: 'row'}}>
      <Text>{label}</Text>
      <Card.FeaturedSubtitle style={{color: 'black'}}>
        {val}
      </Card.FeaturedSubtitle>
    </View>
  );
};

const Home = () => {
  const [isLoading, setLoading] = React.useState(true);
  const [characters, setCharacters] = React.useState([]);
  const [location, setLocation] = React.useState([]);

  useEffect(() => {
    (async function () {
      let locationArr = [];
      let data = await fetch('https://rickandmortyapi.com/api/character').then(
        res => res.json(),
      );

      async function getData() {
        for (const file of data.results) {
          const contents = await fetch(file.location.url)
            .then(res => res.json())
            .catch(er => {
              console.log(er);
            });

          if (contents) {
            const obj = {
              char_id: file.id,
              name: contents.name,
              residentsCount: contents.residents.length,
              dimension: contents.dimension,
            };
            locationArr.push(obj);
          }
        }
      }

      await getData();

      setCharacters(data.results);
      setLocation(locationArr);
      setLoading(false);
    })();
  }, []);

  const renderItem = ({item}) => {
    return (
      <Card containerStyle={styles.cardContainer}>
        <Card.Title h4 style={styles.cardTitle}>
          {`${item.name}`}
        </Card.Title>
        <Card.Divider />
        <View style={styles.direction}>
          <View style={styles.basic}>
            <GroupField char={item} field="species" label="Species" />
            <GroupField char={item} field="gender" label="Gender" />
            <GroupField char={item} field="location.name" label="Location" />
          </View>
          <View style={styles.basic}>
            <Card.Image source={{uri: item.image}} style={styles.cardImage} />
            <Card.FeaturedTitle style={styles.statusStyle}>
              {item.status}
            </Card.FeaturedTitle>
          </View>
        </View>
        <Card.FeaturedTitle style={{color: 'black'}}>Origin</Card.FeaturedTitle>
        <View>
          <OriginGroup
            label="Name :"
            location={location}
            item={item}
            labelKey="name"
          />
          <OriginGroup
            label="Amount of Residents : "
            location={location}
            item={item}
            labelKey="residentsCount"
          />
          <OriginGroup
            label="Dimension :"
            location={location}
            item={item}
            labelKey="dimension"
          />
        </View>
      </Card>
    );
  };
  return (
    <View>
      {isLoading ? (
        <Text>loading</Text>
      ) : (
        <FlatList data={characters} renderItem={renderItem} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 30,
    shadowColor: '#626567',
    shadowOffset: {width: 5, height: 4},
    shadowOpacity: 1,
    shadowRadius: 3,
  },
  cardTitle: {
    paddingTop: 5,
    fontWeight: '600',
  },
  direction: {
    flexDirection: 'row',
  },
  basic: {
    flex: 2,
    justifyContent: 'center',
  },
  statusStyle: {
    color: 'black',
    alignSelf: 'center',
  },
  cardImage: {
    borderRadius: 10,
    height: 150,
  },
});
export default Home;
