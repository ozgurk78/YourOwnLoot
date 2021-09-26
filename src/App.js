import { AppBar, Box, Container, Paper, Toolbar, Typography, TextField, Button, Tabs, Tab } from "@mui/material"
import { useEffect, useState } from "react"
import CustomThemeProvider from "./components/CustomThemeProvider"
import Web3 from 'web3'
import YOL_CONTRACT_ABI from './components/YolContractAbi.json'
import base64 from 'base-64'



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>{children}</Box>
      )}
    </div>
  );
}



const App = () => {


  const [value, setValue] = useState(0)

  const web3 = new Web3(window.ethereum)
  const YOL_CONTRACT_ADDRESS = "0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7"
  const [chainId, setChainId] = useState(null)
  const [account, setAccount] = useState(null)
  const [tokenId, setTokenId] = useState(0)
  const [tokenUri, setTokenUri] = useState("")

  const fetchTokenUri = async () => {
    setTokenUri(null)
    try {
      const yol_contract = new web3.eth.Contract(YOL_CONTRACT_ABI, YOL_CONTRACT_ADDRESS)
      let uri = await yol_contract.methods.tokenURI(tokenId).call()
      setTokenUri(JSON.parse(base64.decode(uri.replace("data:application/json;base64,", "").replace("#", ""))).image)
    } catch (error) {
      setTokenUri(null)
      console.log(error)
      alert("not exists")
    }

  }


  

  const requestAccounts = async () => {
    let res = await window.ethereum.send('eth_requestAccounts');
    return res?.result[0]
  }


  useEffect(() => {

    if (window.ethereum) {

      window.ethereum.on('chainChanged', function(networkId){
        console.log('networkChanged',networkId);
        window.location.reload()
      });

      (async () => {
        try {
          let acc = await requestAccounts()
          console.log(acc)
          setAccount(acc)


          let chainId = await web3.eth.getChainId();
          if (chainId) {
            setChainId(chainId)
          }


        } catch (error) {
          console.log(error)
          window.location.reload()
        }

      })()

    }

    return () => {

    }
  }, [web3.eth])

  if (!window.ethereum) {
    return <CustomThemeProvider>
      <Box
        component={Paper}
        elevation={0}
        sx={{
          minHeight: "100vh",
          borderRadius: 0,
          display: "flex",
          alignItems:"center",
          justifyContent: "center",
          textAlign: "center"
        }}
      >
        <Typography>Install Metamask</Typography>
      </Box>
    </CustomThemeProvider>
  }

  if (chainId !== 1) {
    return <CustomThemeProvider>
      <Box
        component={Paper}
        elevation={0}
        sx={{
          minHeight: "100vh",
          borderRadius: 0,
          display: "flex",
          alignItems:"center",
          justifyContent: "center",
          textAlign: "center"
        }}
      >
        <Typography>Plase Change your network to Ethereum Mainnet </Typography>
      </Box>
    </CustomThemeProvider>
  }


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }


  const handleSupport = async () => {
    await web3.eth.sendTransaction({ from: account, to: "0x70F2f85DD64CcD5257D16A5797216cFb1d17A423", value: web3.utils.toWei("1", "ether") })
  }



  return (
    <CustomThemeProvider>
      <Box
        component={Paper}
        elevation={0}
        sx={{
          minHeight: "100vh",
          borderRadius: 0,
        }}
      >
        <AppBar position="relative" elevation={0} >
          <Toolbar
            component={Container}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: {
                xs: "column",
                md: "row"
              },
            }}
          >
            
            <Box>
           
              <a href="/#">
                <Typography variant="h5">NFT ID Viewer</Typography>
              </a>
             
            </Box>
            
           

            <Box sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>

              <a target="_blank" rel="noreferrer" href="https://twitter.com/ozgur_klncl">
                <Typography variant="body1" sx={{ marginLeft: "10px" }}>Twitter</Typography>
              </a>

              <a target="_blank" rel="noreferrer" href="https://github.com/ozgurk78">
                <Typography variant="body1" sx={{ marginLeft: "10px" }}>Github</Typography>
              </a>

              <a target="_blank" rel="noreferrer" href="https://etherscan.io/address/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7">
                <Typography variant="body1" sx={{ marginLeft: "10px" }}>Contract</Typography>
              </a>

            </Box>
          </Toolbar>
          
          <Box sx={{ borderBottom: 1, borderColor: 'Blue' }} component={Container} >
            <Tabs value={value} onChange={handleChange} >
             
              <Tab label="View" {...a11yProps(1)} />
              <Tab label="Support" {...a11yProps(0)} />
              
            </Tabs>
          </Box>
        </AppBar>




        <TabPanel value={value} index={1}>
          <Container
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                md: "row"
              },
              marginTop: "20px",
              justifyContent: "space-between",
              overflow: "auto",
              width: "100%"
            }}
          >
            
            <Box sx={{
              width: { xs: "100%", md: "45%" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}>

             
                          
            </Box>

          </Container>
        </TabPanel>




        <TabPanel value={value} index={0}>
          <Container
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                md: "row"
              },
              marginTop: "20px",
              justifyContent: "space-between",
              overflow: "auto",
              width: "100%"
            }}
          >

            <Box sx={{ width: { xs: "100%", md: "45%" } }}>

              {
                tokenUri &&
                <img alt="" src={tokenUri} style={{ height: "auto", width: "100%" }} />
              }

            </Box>
            <Box sx={{
              marginTop: "10px",
              width: { xs: "100%", md: "45%" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}>

              <TextField
                variant="outlined"
                label="Token Id (min:0, max:?)"
                sx={{ width: "100%", marginBottom: "10px" }}
                value={tokenId}
                type="number"
                onChange={(e) => setTokenId(e.target.valueAsNumber)}
              />

              <Button
              
                variant="contained"
                sx={{   width: "50%", marginTop: "10px" }}
                onClick={fetchTokenUri}
              >View</Button>

            </Box>

          


          </Container>
        </TabPanel>



        <Box
          sx={{
           
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "150px"
          }}
        >
          <Typography>Support</Typography>
          <Button
            onClick={handleSupport}
            sx={{ marginLeft: "10px" }} variant="outlined">Support 1 ETH</Button>

        </Box>




      </Box>
    </CustomThemeProvider >
  )
}

export default App