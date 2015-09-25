// schema.mongoose.factory.js
var Schema = {};
const SchemaSkeleton = function(Skeleton) {
  const createSchemaField = function(SkeletonAtom) {
    // chamar função que validará cada field se tem a interface correta
    Schema[SkeletonAtom.field] = SkeletonAtom.props;
  }
  Skeleton.forEach(createSchemaField);
  return Schema;
};

module.exports = SchemaSkeleton;