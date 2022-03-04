const data = `First Name,Last Name,E-mail Address,Partner Phone,Home Address,Street Address,Tag
John,Doe,john@doe.name,(770) 664-5225,"5673 Peachtree Dunwoody Rd. Suite 850. Sandy Springs, GA 30342",36 st.,"Warm Agent, Hot Agent"`

const blob = new Blob([data], { type: 'text/csv' })

export default new File([blob], 'contacts.csv', {
  lastModified: new Date().getTime(),
  type: blob.type
})
