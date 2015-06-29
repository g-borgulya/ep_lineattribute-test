exports.eejsBlock_scripts = function (hook_name, args, cb) {
  args.content += "<script src='../static/plugins/ep_oppio/static/js/temp.js'></script>";
  return cb();
}
