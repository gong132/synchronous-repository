// Any plugins you want to use has to be imported
// Detail plugins list see https://www.tinymce.com/docs/plugins/
// Custom builds see https://www.tinymce.com/download/custom-builds/

const plugins = ['advlist anchor autolink autosave code codesample contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime legacyoutput link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount lineheight']
const toolbar = 'undo redo | image | formatselect | bold italic backcolor forecolor | \
alignleft aligncenter alignright alignjustify | \
bullist numlist outdent indent | removeformat'
export {
  plugins,
  toolbar,
}

// const plugins = ['advlist anchor autolink autosave code codesample contextmenu directionality emoticons fullscreen hr imagetools importcss insertdatetime legacyoutput lists nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount lineheight']
// const toolbar = 'undo redo | formatselect | bold italic backcolor forecolor | \
// alignleft aligncenter alignright alignjustify | \
// bullist numlist outdent indent | removeformat'
// export {
//   plugins,
//   toolbar,
// }