import React from 'react'
import { Footer } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { BsFacebook, BsTwitter, BsGithub } from 'react-icons/bs'
export default function FooterCom() {
  return (
    <Footer container className='border border-t-8 border-teal-500'>
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5 ">
          <Link to='/' className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Taufiq's Blog</span>
           </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6" >
            <div>
            <Footer.Title title='About' />
            <Footer.LinkGroup col>
              <Footer.Link>
                100 JS Projects
              </Footer.Link>
              <Footer.Link href='/about'>
                Taufiq's Blog
              </Footer.Link>
            </Footer.LinkGroup>
            </div>
            <div>
            <Footer.Title title='Follow me' />
            <Footer.LinkGroup col>
              <Footer.Link href='https://github.com/Tauf4430d'  target='_blank' rel='noopener noreferrer'>
                GitHub
              </Footer.Link>
              <Footer.Link href='https://twitter.com/tauf_443od' target='_blank' rel='noopener noreferrer'>
                Twitter
              </Footer.Link>
            </Footer.LinkGroup>
            </div>
            <div>
            <Footer.Title title='Legal' />
            <Footer.LinkGroup col>
              <Footer.Link >
              Privacy Policy
              </Footer.Link>
              <Footer.Link>
                Terms &amp; Conditions
              </Footer.Link>
            </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright href='#' by="Taufiq's Blog" year={new Date().getFullYear()}/>
          <div className='flex gap-6 sm:mt-0 mt-4 sm:justify-center'>
            <Footer.Icon href='#' icon={BsFacebook}/>
            <Footer.Icon href='https://github.com/Tauf4430d' icon={BsGithub} target='_blank'/>
            <Footer.Icon href='https://twitter.com/tauf_443od' icon={BsTwitter} target='_blank'/>
          </div>
        </div>
      </div>
    </Footer>
  )
}
