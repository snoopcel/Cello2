import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Music2, Eye, EyeOff, Trash2, Plus, Lock } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { themes } from './components/themes'

const defaultData = {
  username:'Cello Official',
  subtitle:'Dark Forest Cyber Theme',
  avatar:'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=800',
  pin:'0000',
  theme:'green',
  links:[
    {id:'1',name:'Instagram',url:'https://instagram.com',visible:true},
    {id:'2',name:'TikTok',url:'https://tiktok.com',visible:true},
    {id:'3',name:'YouTube',url:'https://youtube.com',visible:true},
  ]
}

export default function App(){

  const [admin,setAdmin] = useState(false)
  const [pinInput,setPinInput] = useState('')

  const [data,setData] = useState(()=>{
    const saved = localStorage.getItem('cello-premium')
    return saved ? JSON.parse(saved) : defaultData
  })

  useEffect(()=>{
    localStorage.setItem('cello-premium',JSON.stringify(data))
    const c = themes[data.theme]
    document.documentElement.style.setProperty('--accent',c)
    document.documentElement.style.setProperty('--soft',c+'55')
  },[data])

  const reorder = (result)=>{
    if(!result.destination) return
    const items = [...data.links]
    const [removed] = items.splice(result.source.index,1)
    items.splice(result.destination.index,0,removed)
    setData({...data,links:items})
  }

  return (
    <div className="min-h-screen relative overflow-hidden px-5 py-10">

      <div className="orb top-[-120px] left-[-100px]"></div>
      <div className="orb bottom-[-120px] right-[-100px]"></div>

      <div className="fixed inset-0 z-0">
        {[...Array(25)].map((_,i)=>(
          <motion.div
            key={i}
            className="absolute rounded-full bg-green-400/20"
            style={{
              width:Math.random()*4+2,
              height:Math.random()*4+2,
              left:`${Math.random()*100}%`,
              top:`${Math.random()*100}%`
            }}
            animate={{y:[0,-20,0],opacity:[0.2,1,0.2]}}
            transition={{duration:3+Math.random()*4,repeat:Infinity}}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-md mx-auto">

        <motion.div
          initial={{opacity:0,y:30}}
          animate={{opacity:1,y:0}}
          className="text-center"
        >
          <div className="relative w-36 h-36 mx-auto">
            <div className="absolute inset-0 rounded-full glow"></div>

            <img
              src={data.avatar}
              className="w-full h-full rounded-full object-cover border border-white/10 relative"
            />
          </div>

          <h1 className="text-5xl font-black mt-6">
            {data.username}
          </h1>

          <p className="text-gray-400 mt-3 text-lg">
            {data.subtitle}
          </p>
        </motion.div>

        <div className="space-y-4 mt-10">
          {data.links.filter(x=>x.visible).map((item)=>(
            <motion.a
              whileHover={{scale:1.02}}
              whileTap={{scale:.98}}
              key={item.id}
              href={item.url}
              target="_blank"
              className="link-card glass glow rounded-[28px] p-5 flex items-center gap-4"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{background:'var(--soft)'}}
              >
                ✦
              </div>

              <div>
                <h2 className="font-bold text-lg">{item.name}</h2>
                <p className="text-sm text-gray-400">{item.url}</p>
              </div>
            </motion.a>
          ))}
        </div>

        <button className="fixed bottom-5 right-5 w-16 h-16 rounded-full glass glow flex items-center justify-center">
          <Music2 />
        </button>

        {location.pathname === '/admin' && (
          <div className="mt-10">
            {!admin ? (
              <div className="glass glow rounded-[28px] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Lock />
                  <h1 className="font-bold text-xl">Admin Login</h1>
                </div>

                <input
                  value={pinInput}
                  onChange={(e)=>setPinInput(e.target.value)}
                  placeholder="PIN"
                  type="password"
                  className="w-full rounded-2xl p-4 bg-black/20 border border-white/10 outline-none"
                />

                <button
                  onClick={()=>{
                    if(pinInput === data.pin){
                      setAdmin(true)
                    }else{
                      alert('PIN salah')
                    }
                  }}
                  className="w-full mt-4 rounded-2xl p-4"
                  style={{background:'var(--soft)'}}
                >
                  Login
                </button>
              </div>
            ) : (
              <div className="glass glow rounded-[28px] p-5">
                <h1 className="text-2xl font-black mb-5">
                  Admin Dashboard
                </h1>

                <div className="space-y-4">

                  <input
                    value={data.username}
                    onChange={(e)=>setData({...data,username:e.target.value})}
                    className="w-full rounded-2xl p-4 bg-black/20 border border-white/10 outline-none"
                    placeholder="Username"
                  />

                  <input
                    value={data.subtitle}
                    onChange={(e)=>setData({...data,subtitle:e.target.value})}
                    className="w-full rounded-2xl p-4 bg-black/20 border border-white/10 outline-none"
                    placeholder="Subtitle"
                  />

                  <input
                    type="file"
                    onChange={(e)=>{
                      const file = e.target.files[0]
                      const reader = new FileReader()
                      reader.onload=()=>{
                        setData({...data,avatar:reader.result})
                      }
                      reader.readAsDataURL(file)
                    }}
                  />

                  <div className="flex flex-wrap gap-3">
                    {Object.keys(themes).map((t)=>(
                      <button
                        key={t}
                        onClick={()=>setData({...data,theme:t})}
                        className="w-11 h-11 rounded-full border border-white/20"
                        style={{background:themes[t]}}
                      />
                    ))}
                  </div>

                  <DragDropContext onDragEnd={reorder}>
                    <Droppable droppableId="links">
                      {(provided)=>(
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-3"
                        >
                          {data.links.map((item,index)=>(
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided)=>(
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="glass rounded-3xl p-4"
                                >
                                  <input
                                    value={item.name}
                                    onChange={(e)=>{
                                      const arr=[...data.links]
                                      arr[index].name=e.target.value
                                      setData({...data,links:arr})
                                    }}
                                    className="w-full rounded-xl p-3 bg-black/20 mb-2 outline-none"
                                  />

                                  <input
                                    value={item.url}
                                    onChange={(e)=>{
                                      const arr=[...data.links]
                                      arr[index].url=e.target.value
                                      setData({...data,links:arr})
                                    }}
                                    className="w-full rounded-xl p-3 bg-black/20 outline-none"
                                  />

                                  <div className="flex gap-2 mt-3">
                                    <button
                                      onClick={()=>{
                                        const arr=[...data.links]
                                        arr[index].visible=!arr[index].visible
                                        setData({...data,links:arr})
                                      }}
                                      className="p-3 rounded-xl bg-black/20"
                                    >
                                      {item.visible ? <Eye size={18}/> : <EyeOff size={18}/>}
                                    </button>

                                    <button
                                      onClick={()=>{
                                        setData({
                                          ...data,
                                          links:data.links.filter((_,i)=>i!==index)
                                        })
                                      }}
                                      className="p-3 rounded-xl bg-red-500/20"
                                    >
                                      <Trash2 size={18}/>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>

                  <button
                    onClick={()=>{
                      setData({
                        ...data,
                        links:[
                          ...data.links,
                          {
                            id:Date.now().toString(),
                            name:'New Link',
                            url:'https://',
                            visible:true
                          }
                        ]
                      })
                    }}
                    className="w-full rounded-2xl p-4 flex items-center justify-center gap-2"
                    style={{background:'var(--soft)'}}
                  >
                    <Plus size={18}/>
                    Tambah Link
                  </button>

                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
