import React from 'react'
import { Input } from './ui/input'
import { Search } from 'lucide-react';


const SearchInput = ({placeholder}:{placeholder:string}) => {
  return (
    <div className='relative sm:hidden'>
        <Search className='absolute h-4 w-4 top-3 left-4 text-muted-foreground' />
     <Input type="text" placeholder={placeholder} className='bg-primary/10 pl-10 ' />
    </div>
  )
}

export default SearchInput