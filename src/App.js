import { AppBar, Box, Container, Paper, Toolbar, Typography, TextField, Button, Divider, Tabs, Tab } from "@mui/material"
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
  const YOL_CONTRACT_ADDRESS = "0x11729D9EeC7186Ec6F4944ab72ef8EF65FF565ed"

  const [chainId, setChainId] = useState(null)

  const [account, setAccount] = useState(null)


  const [spec1, setSpec1] = useState("...")
  const [spec2, setSpec2] = useState("...")
  const [spec3, setSpec3] = useState("...")
  const [spec4, setSpec4] = useState("...")
  const [spec5, setSpec5] = useState("...")
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


  const handleMintYourOwnLoot = async () => {
    try {
      const yol_contract = new web3.eth.Contract(YOL_CONTRACT_ABI, YOL_CONTRACT_ADDRESS)
      console.log(yol_contract.methods)
      await yol_contract.methods.mint(tokenId, spec1, spec2, spec3, spec4, spec5).send({ from: account })
    } catch (error) {
      console.log(error)
      alert("error")
    }
  }

  const requestAccounts = async () => {
    let res = await window.ethereum.send('eth_requestAccounts');
    return res?.result[0]
  }


  useEffect(() => {

    if (window.ethereum) {

      (async () => {
        try {
          let acc = await requestAccounts()
          console.log(acc)
          setAccount(acc)


          let chainId = await web3.eth.getChainId();
          if (chainId) {
            setChainId(chainId)
          }

          fetchTokenUri(0)

        } catch (error) {
          console.log(error)
          window.location.reload()
        }

      })()

    }

    return () => {

    }
  }, [])

  if (!window.ethereum) {
    return <Typography>Install Metamask</Typography>
  }

  if (chainId !== 43114) {
    return <Typography>Plase Change your network to Avalanche Mainnet C-Chain</Typography>
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
    await web3.eth.sendTransaction({ from: account, to: "0x575CBC1D88c266B18f1BB221C1a1a79A55A3d3BE", value: web3.utils.toWei("1", "ether") })
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
                <Typography variant="h5">Your Own Loot</Typography>
              </a>
            </Box>
            <Box sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>

              <a target="_blank" rel="noreferrer" href="https://github.com/c-8-r/YourOwnLoot">
                <Typography variant="body1" sx={{ marginLeft: "10px" }}>Github</Typography>
              </a>

              <a target="_blank" rel="noreferrer" href="https://avascan.info/blockchain/c/address/0x11729D9EeC7186Ec6F4944ab72ef8EF65FF565ed">
                <Typography variant="body1" sx={{ marginLeft: "10px" }}>Contract</Typography>
              </a>
            </Box>
          </Toolbar>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }} component={Container} >
            <Tabs value={value} onChange={handleChange} >
              <Tab label="Mint" {...a11yProps(0)} />
              <Tab label="View" {...a11yProps(1)} />
            </Tabs>
          </Box>
        </AppBar>


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

              <svg version="1.2" baseProfile="tiny-ps" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 384">
                <rect width="100%" height="100%" fill="black" /><text>
                  <tspan x="25" y="50">{spec1}</tspan><tspan x="25" y="75">{spec2}</tspan><tspan x="25" y="100">{spec3}</tspan>
                  <tspan x="25" y="125">{spec4}</tspan><tspan x="25" y="150">{spec5}</tspan><tspan x="250" y="350">#{tokenId}</tspan></text></svg>

            </Box>
            <Box sx={{
              width: { xs: "100%", md: "45%" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}>

              <TextField
                variant="outlined"
                label="Spec 1"
                sx={{ width: "100%", marginBottom: "10px" }}
                value={spec1}
                onChange={(e) => setSpec1(e.target.value)}
              />
              <TextField
                variant="outlined"
                label="Spec 2"
                sx={{ width: "100%", marginBottom: "10px" }}
                value={spec2}
                onChange={(e) => setSpec2(e.target.value)}
              />
              <TextField
                variant="outlined"
                label="Spec 3"
                sx={{ width: "100%", marginBottom: "10px" }}
                value={spec3}
                onChange={(e) => setSpec3(e.target.value)}
              />
              <TextField
                variant="outlined"
                label="Spec 4"
                sx={{ width: "100%", marginBottom: "10px" }}
                value={spec4}
                onChange={(e) => setSpec4(e.target.value)}
              />
              <TextField
                variant="outlined"
                label="Spec 5"
                sx={{ width: "100%", marginBottom: "10px" }}
                value={spec5}
                onChange={(e) => setSpec5(e.target.value)}
              />

              <TextField
                variant="outlined"
                label="Token Id (min:0, max:10000)"
                sx={{ width: "100%", marginBottom: "10px" }}
                value={tokenId}
                type="number"
                onChange={(e) => setTokenId(e.target.valueAsNumber)}
              />

              <Button
                variant="contained"
                sx={{ width: "50%", marginTop: "10px" }}
                onClick={handleMintYourOwnLoot}
              >Mint</Button>
            </Box>

          </Container>
        </TabPanel>
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

            <Box sx={{ width: { xs: "100%", md: "45%" } }}>

              {
                tokenUri &&
                <img src={tokenUri} style={{ height: "auto", width: "100%" }} />
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
                label="Token Id (min:0, max:10000)"
                sx={{ width: "100%", marginBottom: "10px" }}
                value={tokenId}
                type="number"
                onChange={(e) => setTokenId(e.target.valueAsNumber)}
              />

              <Button
                variant="contained"
                sx={{ width: "50%", marginTop: "10px" }}
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
          <Typography>Created by c8r.eth</Typography>
          <Button
            onClick={handleSupport}
            sx={{ marginLeft: "10px" }} variant="outlined">Support 1 AVAX</Button>

        </Box>

      </Box>
    </CustomThemeProvider >
  )
}

export default App