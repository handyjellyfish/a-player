// Quick test to verify URL.createObjectURL works
const file = new File(['test'], 'test.mp3', { type: 'audio/mpeg' })
const url = URL.createObjectURL(file)
console.log('URL created:', url)
console.log('URL protocol:', url.split(':')[0])
