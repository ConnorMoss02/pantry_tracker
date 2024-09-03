'use client'
import Image from "next/image";
import {useState, useEffect} from 'react'
import {firestore} from '@/firebase'
import{Box, Button, Modal, Stack, TextField, Typography, Card, CardContent, CardActions, Switch, FormControlLabel} from '@mui/material'
import {collection, doc, getDocs, query, setDoc, deleteDoc, getDoc} from 'firebase/firestore'

export default function Home() {
  const [inventory, setInventory] = useState([])
  //const [setLoading, loading] = useState(false)
  const [isAdding, setIsAdding] = useState (false) //Loading Function
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchTerm, setSearchTerm] = useState('') // Search Bar State
  const [darkMode, setDarkMode] = useState(false) // Dark Mode State

  const updateInventory = async() => {
    setIsAdding(true);
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    if (inventoryList.length >= 5) {
      inventoryList.shift() // Remove the oldest item
    }
    setInventory(inventoryList)
    setIsAdding(false)
    //console.log(inventoryList)
  }

  useEffect(() => {
    updateInventory
  }, [])

  const addItem = async (item) => {
    setIsAdding(true)
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else{
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
    setIsAdding(false)
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()) {
      const { quantity } = docSnap.data()
      if ( quantity === 1 ) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const filteredInventory = inventory.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return (
    <Box 
      bgcolor={darkMode ? '#333' : '#fff'}
      color={darkMode ? '#fff' : '#000'}
      width = "100vw" 
      height = "100vh" 
      display = "flex" 
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >

      {/* Dark Mode Toggle */}
      <FormControlLabel
        control={
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            color="primary"
          />
        }
        label="Dark Mode"
      />

      {/* Loading Indicator */}
      {isAdding && (
        <Typography variant="h4">Loading...</Typography>
      )}
      
      <Modal 
        open={open} 
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          position="absolute" 
          top="50%" 
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform:"translate(-50%,-50%)"
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack 
            width="100%"
            direction="row"
            spacing={2}>
              <TextField
                variant='outlined'
                fullWidth
                value={itemName}
                onChange={(e)=>{
                  setItemName(e.target.value)
              }}
            />
            <Button
              variant="outlined" 
              onClick={()=>{
                addItem(itemName)
                setItemName('')
                handleClose()
            }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button 
        variant = "contained" 
        onClick={handleOpen}>
          Add New Item
      </Button>
      <Box border = {'1px solid #333'}>
        <Box 
          width="800px" 
          height="100px" 
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center" 
          justifyContent="center"
        >
          <Typography variant ="h2" color = "#333" textAlign="center">
              Inventory Items
          </Typography>
        </Box>

        {/* Search box */}
        <Box width="800px" padding={2}>
          <TextField
            variant="outlined"
            label="Search Items"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>

        {/* Inventory List */}
        <Stack width= "800px" height = "300px" spacing={2} overflow="auto">
          {filteredInventory.map(({name, quantity}) => (
            <Card key={name} sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
             <CardContent>
               <Typography variant="h5">{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
               <Typography>Quantity: {quantity}</Typography>
              </CardContent>
              <CardActions>
                <Button variant = "contained" onClick={()=> removeItem(name)}> 
                  Remove
                </Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
      </Box>
    </Box>
    )
            }

