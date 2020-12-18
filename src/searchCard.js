import React from 'react';
import { StyleSheet, View, Image, Text, Button, ActivityIndicator, Dimensions } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { FlatGrid, SectionGrid } from 'react-native-super-grid';
import FlipCard from 'react-native-flip-card';
let { width, height } = Dimensions.get('window');

/**
 * Profile screen
 */
export default class SearchCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          isLoading: true,
          search: '',
          cards: []
        }
      }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('name'),//name
        };
    };

    async componentDidMount() {
        await this.setState({isLoading: false});
    }

    cardFace(card){
        //[styles.cardf, { backgroundColor: '#412', }]
        if(card.hasOwnProperty("img")){
            return(
                <View style={styles.cardf}>
                    <Image
                        style={styles.cardImg}
                        source={{
                        uri: card.img,
                        }}
                    />
                </View>
            )
        }
        else{
            return(
                <View style={styles.cardf}>
                    <Text style={styles.cardName}>{card.name}</Text>
                </View>
            )
        }
    }

    cardBack(card){
        return(
            <View style={styles.cardb}>
                <View style={styles.cardDesc}>
                    <Text><Text style={styles.cardbT}>Name: </Text><Text style={styles.cardbN}>{card.name}</Text></Text>
                    <Text><Text style={styles.cardbT}>Class: </Text><Text style={styles.cardbN}>{card.playerClass}</Text></Text>
                    <Text><Text style={styles.cardbT}>Set: </Text><Text style={styles.cardbN}>{card.cardSet}</Text></Text>
                    {card.hasOwnProperty("Enchantment") ? <Text><Text style={styles.cardbT}>Type: </Text><Text style={styles.cardbN}>{card.Enchantment}</Text></Text> : null}
                    {card.hasOwnProperty("rarity") ? <Text><Text style={styles.cardbT}>Rarity: </Text><Text style={styles.cardbN}>{card.rarity}</Text></Text> : null}
                    {card.hasOwnProperty("collectible") ? <Text><Text style={styles.cardbT}>Collectible: </Text><Text style={styles.cardbN}>{String(card.collectible)}</Text></Text> : null}
                    <Text>
                        {card.hasOwnProperty("cost") ? <Text><Text style={styles.cardbT}>Cost: </Text><Text style={styles.cardbN}>{card.cost}  </Text></Text> : null}
                        {card.hasOwnProperty("attack") ? <Text><Text style={styles.cardbT}>Attack: </Text><Text style={styles.cardbN}>{card.attack}  </Text></Text> : null}
                        {card.hasOwnProperty("health") ? <Text><Text style={styles.cardbT}>Health: </Text><Text style={styles.cardbN}>{card.health}  </Text></Text> : null}
                    </Text>
                    {card.hasOwnProperty("text") ? <Text><Text style={styles.cardbT}>Description: </Text><Text style={styles.cardbN}>{card.text.replace(/(<([^>]+)>)/ig, '')}</Text></Text> : null}
                </View>
            </View>
        )
    }



    renderCard(item,index){
        return(
          <FlipCard 
            style={styles.card}
            friction={6}
            perspective={1000}
            flipHorizontal={true}
            flipVertical={false}
            flip={true}
            clickable={true}
            onFlipEnd={(isFlipEnd)=>{}}
          >
            {/* Back Side */}
            {this.cardBack(item)}
            {/* Face Side */}
            {this.cardFace(item)}
          </FlipCard>
          )
      }

     updateSearch = (search) => {
        this.setState({search});
        if(search.length>0){
            let query = "https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/search/"+search;
            console.log(query)
            fetch(query,{
                method: 'Get',
                headers: {
                "x-rapidapi-key": "13ed3f8bd9msh9de1ca3ea5c6ee5p13732fjsn6fd5eb1f0624",
                "x-rapidapi-host": "omgvamp-hearthstone-v1.p.rapidapi.com",
                "useQueryString": true
                }
            }).then((response) => response.json()).then((res)=>{
                this.setState({ 
                    cards: res
                });
            })
        }
    };

    render() {

        const { navigate, state } = this.props.navigation;
        const { search, cards } = this.state;

        if (this.state.isLoading) {
            return (
              <View style={{ flex: 1, padding: 20 }}>
                <Image style= { styles.backgroundImage } source={require("../resources/image/bg.jpg")} />
                <ActivityIndicator size="large" color="#0055ff" />
              </View>
            )
        }

        return (
            <>
                <Image style= { styles.backgroundImage } source={require("../resources/image/bg.jpg")} />

                <SearchBar
                    placeholder="Type Here..."
                    onChangeText={this.updateSearch}
                    value={search}
                />

                <View style={styles.container}>
                    {
                        (search.length>0 && cards.length>0)?<FlatGrid
                        itemDimension={width/3}
                        data={cards}
                        style={styles.gridView}
                        // staticDimension={300}
                        // fixed
                        spacing={10}
                        renderItem={({item,index}) => this.renderCard(item,index)}
                        />:null
                    }

                </View>
            </>
        );

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    gridView: {
        marginTop: 10,
        flex: 1,
    },
    itemContainer: {
        justifyContent: 'flex-end',
        borderRadius: 5,
        padding: 10,
        height: 150,
        margin:10,
        padding: 10,
    },
    cardf:{
        justifyContent: "center",
        alignItems: 'center',
        borderWidth: 2,
        borderColor: "#000",
        borderRadius: 5,
        height: height/3,
        //alignSelf: 'center'        
    },
    cardb:{
        backgroundColor: 'rgba(255, 0, 255, 0.5)',
        borderWidth: 2,
        borderColor: "#000",
        borderRadius: 5,
        height: height/3,
    },
    cardImg:{
        alignSelf: 'center',
        resizeMode: 'cover',
        ...StyleSheet.absoluteFillObject,
    },
    cardContainer:{},
    card:{},
    cardName:{
        justifyContent: "center",
        textAlign: "center",
        fontSize: width/20,
        fontWeight: "bold",
    },
    cardbT:{
        fontWeight: "bold",
        fontSize: width/30,
    },
    cardbN:{
        fontSize: width/30,
    },
    cardDesc:{
        flex: 1,
        alignSelf: 'center',
    },
    backgroundImage:{
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      opacity: 0.5,
      width: width,
      height: height,
    },
});